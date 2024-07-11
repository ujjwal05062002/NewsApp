import React, { useEffect, useState } from 'react';
import NewsItem from './NewsItem';
import InfiniteScroll from 'react-infinite-scroll-component';

export default function Home(props) {
    const [totalResults, setTotalResults] = useState(0);
    const [articles, setArticles] = useState([]);
    const [page, setPage] = useState(1);
    const [q, setQ] = useState("All");

    const getAPIData = async (query) => {
        setPage(1);
        setQ(query);

        try {
            const response = await fetch(`https://newsapi.org/v2/everything?q=${query}&page=1&pageSize=12&language=${props.language}&sortBy=publishedAt&apiKey=9a57fe8c40e64e4da0eddcbe81c2d6f3`);
            const data = await response.json();

            if (data.articles) {
                setArticles(data.articles.filter((x) => x.title !== "[Removed]"));
                setTotalResults(data.totalResults);
            } else {
                console.error("No articles found in response:", data);
            }
        } catch (error) {
            console.error("Error fetching API data:", error);
        }
    };

    const fetchData = async () => {
        const nextPage = page + 1;

        try {
            const response = await fetch(`https://newsapi.org/v2/everything?q=${q}&page=${nextPage}&pageSize=12&language=${props.language}&sortBy=publishedAt&apiKey=9a57fe8c40e64e4da0eddcbe81c2d6f3`);
            const data = await response.json();

            if (data.articles) {
                setArticles(articles.concat(data.articles.filter((x) => x.title !== "[Removed]")));
                setPage(nextPage);
            } else {
                console.error("No articles found in response:", data);
            }
        } catch (error) {
            console.error("Error fetching more data:", error);
        }
    };

    useEffect(() => {
        if (props.search) {
            getAPIData(props.search);
        } else {
            getAPIData(props.q);
        }
    }, [props.search, props.q, props.language]);

    return (
        <>
            <div className="container-fluid my-3">
                <h4 className='text-light bg-secondary text-center p-2'>{props.q} News Articles</h4>
            </div>
            <InfiniteScroll
                className='infinite'
                dataLength={articles.length}
                next={fetchData}
                hasMore={articles.length < totalResults}
                loader={
                    <div className='text-center p-5'>
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                }
                endMessage={
                    <p style={{ textAlign: 'center' }}>
                        <b>No more news articles</b>
                    </p>
                }
            >
                <div className="row">
                    {articles.map((item, index) => (
                        <NewsItem
                            key={index}
                            title={item.title}
                            description={item.description}
                            source={item.source.name}
                            url={item.url}
                            pic={item.urlToImage}
                            date={new Date(item.publishedAt).toLocaleDateString()}
                        />
                    ))}
                </div>
            </InfiniteScroll>
        </>
    );
}
