
// import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import "./toast.css";


export const showStyledToast = (type, heading, detail, OnClick) => {
    if (type == 'info') {
        toast.info(

            <div className="custom-toast" onClick={OnClick}>

            </div>,
            {
                position: toast.POSITION.TOP_CENTER, // Toast position
                autoClose: 7000, // Auto-close after 5 seconds
                hideProgressBar: false, // Show progress bar
                closeOnClick: true, // Close on click
                pauseOnHover: true, // Pause auto-close on hover
            }
        );
    }
};