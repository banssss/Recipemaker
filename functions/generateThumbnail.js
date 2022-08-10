import { Storage } from "@google-cloud/storage";
import sharp from "sharp";

export async function generateImgToThumb(event, context) {
  console.log("===== HELLO, TRIGGER IS STARTED =====");

  // thumbNail 로 변환된 파일을 다시 write(저장) 할 때도, 트리거가 실행된다. (재귀의 일종)
  // thumb 폴더로 저장된 파일을 다시 읽어올 때, 함수를 종료한다.
  if (event.name.includes("thumb/")) return;

  // 한 파일당 총 3회 변환 - 저장의 단계를 진행
  const sizes = [
    [320, "s"],
    [640, "m"],
    [1280, "l"],
  ];

  // 변환할 파일명 추출
  let name = event.name;

  // 업로드 한 파일들은, 1차적으로 temp/ 디렉토리에 저장한다.
  // 파일명에서 temp/ 분리하여 파일명만 가져올 수 있도록 처리
  name = name.replace("temp/", "");

  // 변환된 파일의 확장자를 png 로 맞추어 저장하기 위한 확장자 분리
  name = name.replace(".jpg", "");
  name = name.replace(".jpeg", "");

  // 미디어파일을 Stream 형식으로 Read / Write 할 수 있도록 Storage 선언
  const storage = new Storage().bucket(event.bucket);

  // Promise.all 을 통한 통합저장 (3회)
  await Promise.all(
    sizes.map(([size, dir]) => {
      return new Promise((resolve, reject) => {
        storage
          .file(`temp/${name}.jpg`)
          .createReadStream()
          .pipe(sharp().resize({ width: size }))
          // ex) thumb/m/image.png 형식으로 write 하기 위한 변환 pipe
          .pipe(storage.file(`thumb/${dir}/${name}.png`).createWriteStream())
          .on("finish", () => resolve())
          .on("error", (e) => reject(console.log(e)));
      });
    })
  );

  console.log("===== BYE, TRIGGER IS TERMINATED =====");
}
