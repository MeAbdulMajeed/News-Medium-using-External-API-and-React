import React, { useEffect, useState } from "react";
import Newsitem from "./Newsitem";
import Spinner from "./Spinner";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";

const News = (props) => {
    
    const [articles, setArticles] = useState([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [totalResults, setTotalResults] = useState(0)

    const capitalFirstLett = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    const updatedNews = async () => {
        props.setProgress(10);
        const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=99df277d324948c487d53f7b23809b54&page=${page}&pageSize=${props.pageSize}`;
        setLoading(true)
        let data = await fetch(url);
        props.setProgress(70);
        let parseData = await data.json();
        // props.setProgress(70);

        setArticles(parseData.articles)
        setTotalResults(parseData.totalResults)
        setLoading(false)
        // console.log(totalResults)
        props.setProgress(100)
    }

    useEffect(() => {
        
    document.title = `News Medium - ${capitalFirstLett(props.category)}`;
        updatedNews();
    }, [])

    // const handlePrevClick = async () => {
    //     setPage(page - 1)
    //     updatedNews();
    // };

    // const handleNextClick = async () => {
    //     setPage(page + 1)
    //     updatedNews();
    // };

    const fetchMoreData = async () => {
        const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=99df277d324948c487d53f7b23809b54&page=${page + 1}&pageSize=${props.pageSize}`;
        setPage(page + 1)
        let data = await fetch(url);
        let parseData = await data.json();
        // console.log("hello")
        setArticles(articles.concat(parseData.articles))
        setTotalResults(parseData.totalResults)
    };

        return (
            <>
                <h1 className="text-center" style={{ margin: "30px 0px", marginTop: "90px" }}>
                    News Medium - Top {capitalFirstLett(props.category)} Headlines</h1>

                {loading && <Spinner/>}

                <InfiniteScroll
                    dataLength={articles.length}
                    next={fetchMoreData}
                    hasMore={articles.length !== totalResults}
                    loader={<Spinner />}
                >

                    <div className="container">

                        <div className="row">
                            {articles.map((element) => {
                                return <div className="col-md-4" key={element.url}>
                                    <Newsitem
                                        title={element.title ? element.title : ""}
                                        description={element.description ? element.description : ""}
                                        imageUrl={element.urlToImage}
                                        newsUrl={element.url}
                                        author={element.author}
                                        date={element.publishedAt}
                                        source={element.source.name} />
                                </div>
                            })}
                        </div>
                    </div>
                </InfiniteScroll>
            </>
        )
}

News.defaultProps = {
    country: "us",
    pageSize: 15,
    category: "general",
};

News.PropsTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
};

export default News;
