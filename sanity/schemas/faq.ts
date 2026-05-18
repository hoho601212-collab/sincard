import { defineField, defineType } from "sanity";

export default defineType({
  name: "faq",
  title: "자주 묻는 질문",
  type: "document",
  fields: [
    defineField({
      name: "question",
      title: "질문",
      type: "string",
      validation: (Rule) => Rule.required().error("질문을 입력해주세요"),
    }),
    defineField({
      name: "answer",
      title: "답변",
      type: "array",
      of: [
        {
          type: "block",
          styles: [
            { title: "본문", value: "normal" },
            { title: "제목 1", value: "h1" },
            { title: "제목 2", value: "h2" },
            { title: "제목 3", value: "h3" },
          ],
          lists: [
            { title: "불릿 리스트", value: "bullet" },
            { title: "번호 리스트", value: "number" },
          ],
          marks: {
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Italic", value: "em" },
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "Link",
                fields: [
                  {
                    name: "href",
                    type: "url",
                    title: "URL",
                  },
                ],
              },
            ],
          },
        },
        {
          type: "image",
          options: { hotspot: true },
        },
      ],
    }),
    defineField({
      name: "category",
      title: "카테고리",
      type: "string",
      options: {
        list: [
          { title: "수강 관련", value: "course" },
          { title: "결제 관련", value: "payment" },
          { title: "계정 관련", value: "account" },
          { title: "기타", value: "etc" },
        ],
      },
      initialValue: "etc",
    }),
    defineField({
      name: "order",
      title: "순서",
      type: "number",
      initialValue: 0,
    }),
    defineField({
      name: "isPublished",
      title: "공개 여부",
      type: "boolean",
      initialValue: true,
    }),
  ],
  orderings: [
    {
      title: "순서",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "question",
      category: "category",
      published: "isPublished",
    },
    prepare({ title, category, published }) {
      const categoryMap: Record<string, string> = {
        course: "수강",
        payment: "결제",
        account: "계정",
        etc: "기타",
      };
      return {
        title: `${published ? "" : "[비공개] "}${title}`,
        subtitle: categoryMap[category] || category,
      };
    },
  },
});
