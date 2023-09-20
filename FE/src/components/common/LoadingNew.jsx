function LoadingNew() {
    return (
        <div className="loading">
            <div className="lds-roller">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
            <div style={{ opacity: "0.1" }} className="fade modal-backdrop show loading"></div>
        </div>
    );
}

export default LoadingNew;
