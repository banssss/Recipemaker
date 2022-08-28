# RecipeMaker
> 가지고 있는 재료를 입력하면, 레시피가 뚝딱!

우리 집 냉장고엔 어떤 재료들이 숨어있나요?

냉장고 속 재료들을 입력하면,
레시피를 추천해 드립니다!


## 배포 주소 ( 아직 배포준비 중. 배포 예정 )

[https://recipemaker.shop](https://recipemaker.shop)


## 기술 스택

|BACKEND|||
|---|---|---|
|Framework|<img src="https://img.shields.io/badge/nestjs-E0234E?style=for-the-badge&logo=nestjs&logoColor=black">|<img src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black"><img src="https://img.shields.io/badge/typescript-3178C6?style=for-the-badge&logo=typescript&logoColor=black">|
|API|<img src="https://img.shields.io/badge/GraphQL-E10098?style=for-the-badge&logo=graphql&logoColor=white">|<img src="https://img.shields.io/badge/Apollo GraphQL-311C87?style=for-the-badge&logo=apollographql&logoColor=white">|
|Auth|<img src="https://img.shields.io/badge/JWT-d63aff?style=for-the-badge&logo=jwt&logoColor=white"><img src="https://img.shields.io/badge/OAuth2.0-4479A1?style=for-the-badge">|<img src="https://img.shields.io/badge/google-4285F4?style=for-the-badge&logo=google&logoColor=white"><img src="https://img.shields.io/badge/naver-03C75A?style=for-the-badge&logo=naver&logoColor=white"><img src="https://img.shields.io/badge/kakao-FFCD00?style=for-the-badge&logo=kakaotalk&logoColor=white">|
|Search|<img src="https://img.shields.io/badge/Elasticsearch-005571?style=for-the-badge&logo=Elasticsearch&logoColor=white">|<img src="https://img.shields.io/badge/logstash-005571?style=for-the-badge&logo=logstash&logoColor=white"><img src="https://img.shields.io/badge/redis-DC382D?style=for-the-badge&logo=redis&logoColor=white">|
|Database|<img src="https://img.shields.io/badge/mysql-4479A1?style=for-the-badge&logo=mysql&logoColor=white">|<img src="https://img.shields.io/badge/TypeORM-4479A1?style=for-the-badge&logo=typeorm&logoColor=white">
|Deployment|<img src="https://img.shields.io/badge/Google Cloud Platform-4285F4?style=for-the-badge&logo=googlecloud&logoColor=white">|<img src="https://img.shields.io/badge/Kubernetes-326CE5?style=for-the-badge&logo=kubernetes&logoColor=white"><img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white">
|SCM|<img src="https://img.shields.io/badge/github-181717?style=for-the-badge&logo=github&logoColor=white">|


## ERD 설계

![](../mainproject-erd.png)

## 파이프라인 (in Search Process)

![](../mainproject-searchpipeline.png)

## 프로젝트 설치 및 실행

Docker 를 통해

Back-end, Database, Redis, Elasticsearch, Logstash 를 설치합니다.

```sh
docker-compose build
docker-compose up
```

## 폴더 구조
```sh
├── elk
│   ├── elasticsearch
│   ├── kibana
│   └── logstash
├── src
│   ├── apis
│   │   ├── auths
│   │   ├── files
│   │   ├── iamports
│   │   ├── levels
│   │   │   └── entities
│   │   ├── materials
│   │   │   └── entities
│   │   ├── payments
│   │   │   └── entities
│   │   ├── products
│   │   │   ├── dto
│   │   │   └── entities
│   │   ├── productsCategories
│   │   │   └── entities
│   │   ├── productsImgs
│   │   │   └── entities
│   │   ├── productsTags
│   │   │   └── entities
│   │   ├── recipes
│   │   │   ├── dto
│   │   │   └── entities
│   │   ├── recipesCategories
│   │   │   └── entities
│   │   ├── recipesImgs
│   │   │   └── entities
│   │   └── users
│   │       ├── dto
│   │       └── entities
│   └── commons
│       ├── auth
│       ├── filter
│       ├── graphql
│       ├── libraries
│       └── type
└── test
```

## .env

```
# DB INFO on DOCKER
DATABASE_TYPE
DATABASE_HOST
DATABASE_PORT
DATABASE_USERNAME
DATABASE_PASSWORD
DATABASE_DATABASE

# Google Login API
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
GOOGLE_CALLBACK_URL

# Naver Login API
NAVER_CLIENT_ID
NAVER_CLIENT_SECRET
NAVER_CALLBACK_URL

# Kakao Login API
KAKAO_CLIENT_ID
KAKAO_CLIENT_SECRET
KAKAO_CALLBACK_URL

LOGIN_REDIRECT_URL

# Iamport API
IAMPORT_REST_API_KEY
IAMPORT_REST_API_SECRET

# GCP API
STORAGE_BUCKET
STORAGE_PROJECT_ID
STORAGE_KET_FILENAME

# TOKEN SECRET
JWT_ACCESS_SECRET
JWT_REFRESH_SECRET

```
