import { cn } from "../utils/utils"
import logoImage from "../assets/logo.png"

function LogoAcademia({ className, showText = true }) {

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative h-12 w-12 overflow-hidden">
          <img

          src={logoImage || "/placeholder.svg"}
          alt="Academia Dois de Ouro"
          className="object-contain h-full w-full"
          />

      </div>
      {showText && (
        <div className="flex flex-col">
          <span className="text-sm font-bold text-[#d4af37]">ACADEMIA</span>
          <span className="text-lg font-bold leading-tight">DOIS DE OURO</span>
        </div>
      )}
    </div>
  )
}

export default LogoAcademia
