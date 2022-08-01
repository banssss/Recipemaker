import {
  ConflictException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  // fetchUsers (모든 사용자)
  findAll() {
    return this.usersRepository.find();
  }

  // fetchUser (계정 (email) 값이 일치하는 사용자)
  findOne({ userMail }) {
    return this.usersRepository.findOne({ where: { email: userMail } });
  }

  // createUser 사용자 생성
  async create({ createUserInput }) {
    const user = await this.usersRepository.findOne({
      where: { email: createUserInput.email },
    });
    // email 정보를 이용해 중복 가입 방지
    if (user)
      throw new ConflictException(
        '이미 존재하는 계정(email)입니다. 다른 계정 정보를 이용하여 가입해주세요.',
      );
    // 입력받은 비밀번호 hash 이용한 암호화
    const hashedPassword = await bcrypt.hash(
      createUserInput.password,
      3.141592,
    );
    createUserInput.password = hashedPassword;
    // 입력받은 내용 저장
    return this.usersRepository.save({
      ...createUserInput, //
    });
  }

  // updateUser 사용자 정보 수정 - 계정 (email)
  async updateUser({ userMail, updateUserInput }) {
    const user = await this.usersRepository.findOne({
      where: { email: userMail },
    });
    // 수정시 newPassword 가 입력된다면, 입력된 newPassword로 비밀번호 변경
    let userInput: any;

    // newPassword 입력되었을 시, 비밀번호 hash로 암호화 후 userInput에 저장
    if (updateUserInput.newPassword) {
      const hashedPassword = await bcrypt.hash(
        updateUserInput.newPassword,
        3.141592,
      );
      updateUserInput.password = hashedPassword;
      userInput = { ...user, ...updateUserInput };
    }
    // newPassword 미입력 시, userInput 설정
    else {
      userInput = { ...user, ...updateUserInput, password: user.password };
    }
    // 수정된 입력값 저장
    const result = await this.usersRepository.save({
      ...userInput,
    });
    return result;
  }

  // updateUserPwd 사용자 비밀번호 변경
  async updateUserPwd({ userMail, newPwd }) {
    const user = await this.usersRepository.findOne({
      where: { email: userMail },
    });
    // 입력받은 새로운 비밀번호 hash로 암호화
    const hashedPassword = await bcrypt.hash(newPwd, 3.141592);

    // 수정된 정보 저장
    return await this.usersRepository.save({
      ...user,
      password: hashedPassword,
    });
  }

  // 입력된 userAccount 값의 중복여부 검증
  async checkUserAccount({ userAccount }) {
    const user = await this.usersRepository.findOne({
      where: { userAccount },
    });
    if (user)
      throw new ConflictException(
        '이미 존재하는 계정(userAccount)입니다. 다른 계정 정보를 등록해주세요.',
      );
  }

  // 입력된 password 값의 일치여부 검증
  async checkUserPassword({ userMail, password }) {
    const user = await this.usersRepository.findOne({
      where: { email: userMail },
    });
    const isAuth = await bcrypt.compare(password, user.password);
    if (!isAuth)
      throw new UnprocessableEntityException(
        '비밀번호(password)가 일치하지 않습니다. 회원정보에 접근할 수 없습니다.',
      );
  }

  // 회원 삭제(탈퇴)
  async deleteUser({ userMail }) {
    // 소프트 삭제 - softDelete 메소드 사용
    const result = await this.usersRepository.softDelete({ email: userMail });
    return result.affected ? true : false;
  }

  // 삭제(탈퇴) 회원 복구 - id 값을 기준으로
  async restoreDeletedUser({ userId }) {
    // 삭제된 데이터 복구 - restore 메소드 사용
    const result = await this.usersRepository.restore({ id: userId });
    return result.affected ? true : false;
  }
}
