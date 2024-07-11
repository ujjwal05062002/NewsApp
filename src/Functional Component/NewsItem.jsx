import React from 'react';

export default function NewsItem(props) {

    return (
        <div className='col-xl-2 col-lg3 col-md-4 cold-sm-6 col-12'>
            <div className="card">
                <img
                    src={props.pic || "/images/noImageFound.jpg"}
                    height="160px"
                    className="card-img-top"
                    alt="..."
                    style={{ display: 'block', width: '100%' }}
                />

                <div className="card-body">
                    <h5 className="card-title">{props.title}</h5>
                    <div className='d-flex justify-content-between source'>
                        <p>{props.source}</p>
                        <p>{props.date}</p>
                    </div>
                    <hr />
                    <p className="card-text">{props.description}</p>
                    <a href={props.url} target='_blank' rel="noreferrer" className="btn btn-secondary w-100 btn-sm">Read Full Article</a>
                </div>
            </div>

        </div>
    );
}
