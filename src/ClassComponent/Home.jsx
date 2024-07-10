import React, { Component } from 'react';
import NewsItem from './NewsItem';


import InfiniteScroll from 'react-infinite-scroll-component';

export default class Home extends Component {
  constructor() {
    super()
    this.state = {
      totalResults: 0,
      articles: [],
      page: 1,
      q: "All"
    }
  }
  async getAPIData(q) {

    this.setState({ page: 1, q: q })

    var response = await fetch(`https://newsapi.org/v2/everything?q=${q}&page=${this.state.page}&pageSize=12&language=${this.props.language}&sortBy=publishedAt&apiKey=9a57fe8c40e64e4da0eddcbe81c2d6f3`)

    response = await response.json()

    if (response.articles) {
      this.setState({
        totalResults: response.totalResults,
        articles: response.articles.filter((x) => x.title !== "[Removed]")
      })
    }
  }


  fetchData = async () => {
    this.setState({ page: this.state.page + 1 })

    var response = await fetch(`https://newsapi.org/v2/everything?q=${this.state.q}&page=${this.state.page}&pageSize=12&language=${this.props.language}&sortBy=publishedAt&apiKey=9a57fe8c40e64e4da0eddcbe81c2d6f3`)

    response = await response.json()

    if (response.articles)
      this.setState({
        articles: this.state.articles.concat(response.articles.filter((x) => x.title !== "[Removed]"))
      })
  }

  componentDidMount() {
    this.getAPIData(this.props.q)
  }

  componentDidUpdate(oldProps) {
    if (this.props !== oldProps) {
      if (this.props.search && this.props.search !== oldProps.search)
        this.getAPIData(this.props.search)
      else
        this.getAPIData(this.props.q)

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
          loader={<div className='text-center' p-5>
            <div class="spinner-border" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>}
          endMessage={
            <p style={{ textAlign: 'center' }}>
              <b>No more news articles</b>
            </p>
          }

        >


          <div className="row">
            {
              this.state.articles.map((item, index) => {
                return <NewsItem
                  key={index}
                  title={item.title}
                  description={item.description}
                  source={item.source.name}
                  url={item.url}
                  pic={item.urlToImage}
                  date={(new Date(item.publishedAt)).toLocaleDateString()}

                />
              })
            }
          </div>
        </InfiniteScroll>
      </>
    );
  }
}
