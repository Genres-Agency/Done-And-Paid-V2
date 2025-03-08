declare module "next-themes/dist/types" {
  export interface ThemeProviderProps {
    children: React.ReactNode;
    defaultTheme?: string;
    attribute?: string;
    value?: { [key: string]: string };
    themes?: string[];
    enableSystem?: boolean;
  }
}
