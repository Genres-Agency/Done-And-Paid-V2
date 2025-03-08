import { Poppins } from "next/font/google";

interface HeaderProps {
  heading: string;
  label: string;
}

export const Header = ({ heading, label }: HeaderProps) => {
  return (
    <div className="flex flex-col space-y-2 text-center mb-4">
      <h1 className="text-2xl font-semibold tracking-tight">{heading}</h1>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
};
