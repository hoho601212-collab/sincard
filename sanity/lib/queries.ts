// 공지사항 - 최신 N개
export const noticesQuery = (limit: number = 5) => `
  *[_type == "notice" && isPublished == true] | order(createdAt desc) [0...${limit}] {
    _id,
    title,
    "slug": slug.current,
    createdAt
  }
`;

// 공지사항 - 전체 목록 (페이지네이션)
export const noticesListQuery = (start: number, end: number) => `
  *[_type == "notice" && isPublished == true] | order(createdAt desc) [${start}...${end}] {
    _id,
    title,
    "slug": slug.current,
    createdAt
  }
`;

// 공지사항 - 전체 개수
export const noticesCountQuery = `
  count(*[_type == "notice" && isPublished == true])
`;

// 공지사항 - 상세
export const noticeBySlugQuery = `
  *[_type == "notice" && slug.current == $slug && isPublished == true][0] {
    _id,
    title,
    content,
    createdAt
  }
`;

// FAQ - 최신 N개
export const faqsQuery = (limit: number = 5) => `
  *[_type == "faq" && isPublished == true] | order(order asc) [0...${limit}] {
    _id,
    question,
    answer,
    category
  }
`;

// FAQ - 전체 (카테고리별)
export const faqsAllQuery = `
  *[_type == "faq" && isPublished == true] | order(order asc) {
    _id,
    question,
    answer,
    category
  }
`;
