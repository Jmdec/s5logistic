import Image from "next/image";

export const Logo = () => (
  <Image
    src="/S5Logo.png" 
    alt="Company Logo"
    width={50} 
    height={50} 
    priority={true} 
  />
);
