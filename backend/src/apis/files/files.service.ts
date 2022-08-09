import { Storage } from '@google-cloud/storage';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FilesService {
  async upload({ files }) {
    // 파일을 클라우드 스토리지에 저장하는 로직
    const waitedFiles = await Promise.all(files);
    // console.log(waitedFiles); // [file, file]

    const bucket = 'codecamp-backend04-storage';
    const storage = new Storage({
      projectId: 'codecamp-backend04',
      keyFilename: 'gcp-file-storage.json',
    }).bucket(bucket);

    // Promise.all 을 이용한, 한번에 기다리기
    // + map 을 이용한 각 파일 배열화 처리
    const results = await Promise.all(
      waitedFiles.map(
        (el) =>
          new Promise((resolve, reject) => {
            el.createReadStream()
              .pipe(storage.file(el.filename).createWriteStream())
              .on('finish', () => resolve(`${bucket}/${el.filename}`))
              .on('error', () => reject('Fail !!'));
          }),
      ),
    );

    return results;
  }

  // 파일 이름(배열) 을 이용한, 클라우드 저장소 파일 삭제
  async delete({ fileNames }) {
    // Creates a client
    const bucket = 'codecamp-backend04-storage';
    const storage = new Storage({
      projectId: 'codecamp-backend04',
      keyFilename: 'gcp-file-storage.json',
    }).bucket(bucket);

    try {
      await Promise.all(
        fileNames.map((fileName: string) => storage.file(fileName).delete()),
      );
    } catch (e) {
      throw new Error(e);
    }
  }
}
