import { Link, useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import InputEmoji from "react-input-emoji";

const GroupPost = (props) => {

    return (
        <>
            <div className="home-content">
                <div className="write-post-container" >
                    <div className="user-profile">
                        <div className="user-avatar" >
                            <img src="https://scontent.fhan17-1.fna.fbcdn.net/v/t39.30808-6/347268730_760943842147720_8513901123308679226_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=a2f6c7&_nc_ohc=yfTUt1NFoDwAX-golwh&_nc_ht=scontent.fhan17-1.fna&oh=00_AfBmHmNQ6LnWisHjtMtgQ30O1LwKXVtOJ3qupcAgIgkUxw&oe=651794D6" alt="" />
                        </div>
                        <div className="user-post-profile">
                            <p >Như Quỳnh</p>
                        </div>
                    </div>
                    <div className="user-action-post">
                        <Button variant="light">
                            <i className="fas fa-ellipsis-h"></i>
                        </Button>
                    </div>
                </div>
                <div className="post-input-container">
                    <InputEmoji
                    />

                    <Button
                        variant="primary"
                        // className={`post-button ${(!imageSrcProfile && !textMessage) ? 'cursor-not-allowed' : ''}`}
                        className='cursor-not-allowed' 
                    >
                        Post
                    </Button>

                    <div className="add-post-links">
                        <Link to="">
                            <img src="./images/watch.png" /> Video
                        </Link>
                        <label htmlFor="image-upload-post" className="upload-label" style={{ cursor: "pointer", alignItems: "center", display: "flex", justifyContent: "center" }}>
                            <img src="./images/photo.png" style={{ marginRight: "10px", width: "20px" }} /> Picture
                            <input
                                id="image-upload-post"
                                type="file"
                                multiple
                                style={{ display: "none" }}
                            />
                        </label>
                        <Link to="">
                            <img src="./images/feeling.png" /> Emotion
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}

export default GroupPost;
