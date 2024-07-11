import React, { Component } from 'react';
import NewsItem from './NewsItem';
import InfiniteScroll from 'react-infinite-scroll-component';

export default class Home extends Component {
    constructor() {
        super();
        this.state = {
            totalResults: 0,
            articles: [],
            page: 1,
            q: "All"
        };
    }

    async getAPIData(q) {
        this.setState({ page: 1, q });

        const response = await fetch(`https://newsapi.org/v2/everything?q=${q}&page=${this.state.page}&pageSize=12&language=${this.props.language}&sortBy=publishedAt&apiKey=9a57fe8c40e64e4da0eddcbe81c2d6f3`);
        const data = await response.json();

        if (data.articles) {
            this.setState({
                totalResults: data.totalResults,
                articles: data.articles.filter(x => x.title !== "[Removed]")
            });
        }
    }

    fetchData = async () => {
        const { page, q } = this.state;
        const nextPage = page + 1;

        const response = await fetch(`https://newsapi.org/v2/everything?q=${q}&page=${nextPage}&pageSize=12&language=${this.props.language}&sortBy=publishedAt&apiKey=9a57fe8c40e64e4da0eddcbe81c2d6f3`);
        const data = await response.json();

        if (data.articles) {
            this.setState({
                articles: [...this.state.articles, ...data.articles.filter(x => x.title !== "[Removed]")],
                page: nextPage
            });
        }
    }

    componentDidMount() {
        this.getAPIData(this.props.q);
    }

    componentDidUpdate(prevProps) {
        if (this.props.q !== prevProps.q || this.props.search !== prevProps.search) {
            this.getAPIData(this.props.search || this.props.q);
        }
    }

    render() {
        return (
            <>
                <div className="container-fluid my-3">
                    <h4 className='text-light bg-secondary text-center p-2'>{this.props.q} News Article</h4>
                </div>
                <InfiniteScroll
                    className='infinite'
                    dataLength={this.state.articles.length}
                    next={this.fetchData}
                    hasMore={this.state.articles.length < this.state.totalResults}
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
                        {this.state.articles.map((item, index) => (
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
}
