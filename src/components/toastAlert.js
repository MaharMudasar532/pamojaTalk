
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const showStyledToast = (type, heading, detail , OnClick ) => {
    if (type == 'info') {
        toast.info(
            <div className="toast-content" onClick={OnClick}>
                {/* <img src="notification-icon.png" alt="Notification Icon" className="toast-icon" /> */}
                <div className="toast-text">
                    <h5>{heading}</h5>
                    <h6>
                        {detail}
                    </h6>
                </div>
            </div>,
            {
                position: toast.POSITION.TOP_RIGHT, // Toast position
                autoClose: 7000, // Auto-close after 5 seconds
                hideProgressBar: false, // Show progress bar
                closeOnClick: true, // Close on click
                pauseOnHover: true, // Pause auto-close on hover
            }
        );
    }
};