import React, { Component } from 'react';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    componentDidCatch(error, errorInfo) {
        // Xử lý lỗi ở đây, ví dụ: ghi log lỗi
        console.error(error);
        console.error(errorInfo);
        this.setState({ hasError: true });
    }
     reload = (()=>{
        window.location.reload()
    })


    render() {
        if (this.state.hasError) {
            // Thay thế bằng component hoặc thông báo lỗi tùy ý
            return <div style={{display : "flex"}}>
               <p> Có lỗi trang quá trình tải trang</p>
              <span>Vui lòng tải lại trang tại <span onClick={this.reload}>đây</span></span>
            </div>;
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
