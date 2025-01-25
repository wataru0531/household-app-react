
 // FireStoreでのエラーなのか、一般的なエラーなのかを分ける関数
// 型ガード
// is演算子
// → 関数が特定の型を返すことを TypeScript に明示的に示すことができる
//   この構文は、型ガード と呼ばれ、関数が true を返した場合、型システムがその引数の型を絞り込むために利用される
//   この関数が true を返した時にのみ 型を絞り込んで指定した型として扱われ、false を返した時には引数の型を絞り込まない
//   ⭐️型ガードを活用することで、条件に応じた型絞り込みができ、型安全なコードを実現することができ
// この場合はtrueを返した時に、errorは{ code: string, message: string } この型を持つとtypescriptに明示的に伝える
export function isFireStoreError(error: unknown): error is { code: string, message: string }{
  // errorはオブジェクトである。errorオブジェクトにはcodeが含まれている
  return typeof error === "object" && error !== null && "code" in error;
}