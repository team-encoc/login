// 랜덤 데이터 생성 유틸리티

const firstNames = ['민준', '서준', '예준', '도윤', '시우', '주원', '하준', '지호', '지후', '준우', '준서', '민재', '유준', '현우', '도현', '지훈', '건우', '우진', '선우', '서진'];
const lastNames = ['김', '이', '박', '최', '정', '강', '조', '윤', '장', '임', '한', '오', '서', '신', '권', '황', '안', '송', '류', '전'];

// 랜덤 이름 생성
export function generateRandomName(): string {
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  return lastName + firstName;
}

// 랜덤 생년월일 생성 (YYYYMMDD 형식)
export function generateRandomBirthDate(): string {
  const currentYear = new Date().getFullYear();
  const year = Math.floor(Math.random() * (currentYear - 1950)) + 1950; // 1950 ~ 현재년도
  const month = Math.floor(Math.random() * 12) + 1; // 1 ~ 12
  const day = Math.floor(Math.random() * 28) + 1; // 1 ~ 28 (모든 월에 존재)
  
  return `${year}${month.toString().padStart(2, '0')}${day.toString().padStart(2, '0')}`;
}

// 랜덤 전화번호 생성 (010-XXXX-XXXX 형식)
export function generateRandomPhone(): string {
  const middle = Math.floor(Math.random() * 9000) + 1000; // 1000 ~ 9999
  const last = Math.floor(Math.random() * 9000) + 1000; // 1000 ~ 9999
  return `010-${middle}-${last}`;
}

// 랜덤 성별 생성
export function generateRandomGender(): 'MALE' | 'FEMALE' {
  return Math.random() < 0.5 ? 'MALE' : 'FEMALE';
}