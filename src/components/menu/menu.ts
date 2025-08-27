interface IMenu {
  name: string;
  path: string;
  icon?: any; //可选
  childMenus?: IMenu[];
}
export function useMenu() {
  const menus: IMenu[] = [
    {
      name: "吃",
      path: "Eat",
      icon: "",
    },
    {
      name: "喝",
      path: "Drink",
      icon: "",
    },
    {
      name: "玩",
      path: "",
      icon: "",
    },
  ];
}
