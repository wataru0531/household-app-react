
 // FireStoreでのエラーなのか、一般的なエラーなのかを分ける関数
// 型ガード
// is演算子
// → 関数が特定の型を返すことを TypeScript に明示的に示すことができる
//   型述語(type predicate、型ガードともいう)と呼ばれる書き方で、この関数が true を返したら、
//   error は { code: string, message: string } 型である」 ことを TypeScript に明示的に伝える
//   FireStoreのエラーが、error = {code: string, message: string} となっている
export function isFireStoreError(error: unknown): error is { code: string, message: string }{
  // errorはオブジェクトである。errorオブジェクトにはcodeが含まれている
  // この下の条件を満たした時にtrueを返す。
  // ⭐️実行時に型を判定し、TypeScriptに型情報を伝える仕組み
  return typeof error === "object" && error !== null && "code" in error;
}