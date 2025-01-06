
// zodを使ったスキーマ

import { z } from "zod";

export const transactionSchema = z.object({
  type: z.enum(["income", "expense"]), // enum ... enumeration。列挙という意味
  date: z.string().min(1, { message: "日付は必須です" }),
  // zodはデフォルトでエラーを吐いてくれるが、英語でしか吐いてくれない。
  // なので日本語で設定を上書きしている
  amount: z.number().min(1, { message: "金額は1円以上が必須です" }),
  content: z.string()
            .min(1, { message: "内容を入力してください" })
            .max(50, { message: "内容は50文字以内にしてください" }),
  category: z.union([  
    z.enum(["食費", "日用品", "住居費", "交際費", "娯楽", "交通費"]), // 支出
    z.enum(["給与", "副収入", "お小遣い"]), // 収入
    z.literal(""), // から文字のみ許容しておく。エラーメッセージを出すため
    // ここでは1つの配列でいいが、支出と収入とでわかりやすいように2つの配列に分ける
  ])
  .refine((val) => val !== "", {
    // 値が空文字ならエラーメッセージを出す
    message: "カテゴリを選択してください",
  }),
});

// TypeScriptの型を生成
// z.infer() → 定義したスキーマからTypeScriptの型を生成することができる
export type Schema = z.infer<typeof transactionSchema>;

// このような記述となる↓↓
// type Schema = {
//   type: "income" | "expense";
//   date: string;
//   amount: number;
//   content: string;
//   category: "食費" | "日用品" | "住居費" | "交際費" | "娯楽" | "交通費" | "給与" | "副収入" | "お小遣い";
// }