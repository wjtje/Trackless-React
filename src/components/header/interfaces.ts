export declare interface menuOption {
  url: string;
  name: string;
  icon: React.ReactNode;
  access?: Array<{
    method: "get" | "post" | "patch" | "delete";
    url: string;
  }>
}