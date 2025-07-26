import { Toaster as Sonner } from "sonner"

const Toaster = ({ ...props }) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      style={
        {
          "--normal-bg": "#182831",
          "--normal-text": "#ffffff",
          "--normal-border": "#2c5282",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
