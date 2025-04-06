import { toast } from "sonner"
interface ToastProps{
    message:string;
}
const showToast = (message:string) => {

    toast(<ToastComponent message={message} />, { duration: 3000 });
}

const ToastComponent=({message}:ToastProps)=>{
    return(
        <div className="w-full absolute bottom-3 bg-transparent flex items-center justify-center">
        <div className="px-4 py-3 flex flex-col w-fit items-center justify-center rounded-[12px] bg-main-black shadow-[0_4px_15px_0_rgba(42,42,42,0.75)]">
            <div className="text-base font-medium leading-[140%] text-main-green">
                {message}
            </div>
        </div>
        </div>
    )
}
export default showToast