function ObjClear(obj: any) {
  for (let key in obj) {
    obj[key] = typeof obj[key as keyof typeof obj] === "number" ? 0 : "";
  }
}
