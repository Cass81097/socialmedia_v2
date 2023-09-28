import "../../../styles/group/right-sidebar-group.css"


const RightSideBarGroup = (props) => {

    return (
        <>
            <div className="right-sidebar-group">
                <div className="right-sidebar-group-main">
                    <h5>About</h5>
                </div>

                <ol className="right-sidebar-about">
                    <li>
                        <i className="fas fa-lock"></i>
                        <div className="right-sidebar-about-content">
                            <h5>Private</h5>
                            <p>Only members can see who's in the group and what they post.</p>
                        </div>

                    </li>

                    <li>
                        <i className="fas fa-eye"></i>
                        <div className="right-sidebar-about-content">
                            <h5>Visible</h5>
                            <p>Anyone can find this group.</p>
                        </div>
                    </li>

                    <li>
                        <i className="fas fa-map-marker-alt"></i>
                        <h5>TP.HCM  · Hanoi, Vietnam</h5>
                    </li>
                </ol>

            </div>
        </>
    );
}

export default RightSideBarGroup;
