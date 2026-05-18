import { defineField, defineType } from "sanity";

export default defineType({
  name: "notice",
  title: "공지사항",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "제목",
      type: "string",
      validation: (Rule) => Rule.required().error("제목을 입력해주세요"),
    }),
    defineField({
      name: "slug",
      title: "URL 슬러그",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "content",
      title: "내용",
      type: "array",
      of: [
        {
          type: "block",
          styles: [
            { title: "본문", value: "normal" },
            { title: "제목1", value: "h2" },
            { title: "제목2", value: "h3" },
          ],
          marks: {
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Italic", value: "em" },
              { title: "Underline", value: "underline" },
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
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: "alt",
              type: "string",
              title: "대체 텍스트",
            },
            {
              name: "caption",
              type: "string",
              title: "캡션",
            },
          ],
        },
      ],
    }),
    defineField({
      name: "isPublished",
      title: "공개 여부",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "createdAt",
      title: "작성일",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
  ],
  orderings: [
    {
      title: "최신순",
      name: "createdAtDesc",
      by: [{ field: "createdAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      date: "createdAt",
      published: "isPublished",
    },
    prepare({ title, date, published }) {
      return {
        title: `${published ? "" : "[비공개] "}${title}`,
        subtitle: new Date(date).toLocaleDateString("ko-KR"),
      };
    },
  },
});
