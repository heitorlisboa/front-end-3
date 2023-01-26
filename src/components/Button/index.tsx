import Link from "next/link";
import type {
  FC,
  ButtonHTMLAttributes,
  AriaAttributes,
  PropsWithChildren,
} from "react";

import styles from "./Button.module.scss";

import { classNames } from "@src/utils";

type GeneralProps = PropsWithChildren<
  {
    className?: string;
    variant?: "contained" | "outlined";
  } & AriaAttributes
>;

type ButtonType = ButtonHTMLAttributes<HTMLButtonElement>["type"];

type AsButtonProps = {
  as?: "button";
  buttonType?: ButtonType;
  linkHref?: undefined;
  onClick?: () => void;
};

type AsLinkProps = {
  as?: "link";
  buttonType?: undefined;
  linkHref?: string;
  onClick?: undefined;
};

type ButtonProps = (AsButtonProps | AsLinkProps) & GeneralProps;

const Button: FC<ButtonProps> = ({
  children,
  className,
  variant = "contained",
  as = "button",
  buttonType = "button",
  linkHref = "/",
  onClick,
  ...ariaAttrs
}) => {
  const classNameList = [styles.button, styles[variant], className];

  switch (as) {
    case "button":
      return (
        <button
          {...classNames(classNameList)}
          type={buttonType}
          {...ariaAttrs}
          onClick={onClick}
        >
          {children}
        </button>
      );

    case "link":
      return (
        <Link {...classNames(classNameList)} href={linkHref} {...ariaAttrs}>
          {children}
        </Link>
      );
  }
};

export default Button;
