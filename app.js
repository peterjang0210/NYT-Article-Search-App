let articleList = [];

const retrieveArticles = function (event) {

    event.preventDefault();

    const keyWord = $("#searchTerm").val().trim();
    const recordNumber = $("#recordNumber").val().trim();
    const startYear = $("#year1").val().trim();
    const endYear = $("#year2").val().trim();
    let queryURL = ''

    if (startYear === '' && endYear !== '') {
        queryURL = `https://api.nytimes.com/svc/search/v2/articlesearch.json?fq=headline:${keyWord}&begin_date=18510101&end_date=${endYear}1231&api-key=A4iMAjQPOE6T2AUfS3nnjye5Ropskxjl`;
    }
    else if (endYear === '' && startYear !== '') {
        queryURL = `https://api.nytimes.com/svc/search/v2/articlesearch.json?fq=headline:${keyWord}&begin_date=${startYear}0101&end_date=20191231&api-key=A4iMAjQPOE6T2AUfS3nnjye5Ropskxjl`;
    }
    else if (startYear === '' && endYear === '') {
        queryURL = `https://api.nytimes.com/svc/search/v2/articlesearch.json?fq=headline:${keyWord}&begin_date=18510101&end_date=20191231&api-key=A4iMAjQPOE6T2AUfS3nnjye5Ropskxjl`;
    }
    else {
        queryURL = `https://api.nytimes.com/svc/search/v2/articlesearch.json?fq=headline:${keyWord}&begin_date=${startYear}0101&end_date=${endYear}1231&api-key=A4iMAjQPOE6T2AUfS3nnjye5Ropskxjl`;
    }

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        for (let i = 0; i < recordNumber; i++) {
            if (response.response.docs[i].byline === undefined) {
                const articleObject = {
                    headline: response.response.docs[i].headline.main,
                    author: "no author",
                    publishDate: response.response.docs[i].pub_date,
                    articleURL: response.response.docs[i].web_url
                };
                articleList.push(articleObject);
            }
            else {
                const articleObject = {
                    headline: response.response.docs[i].headline.main,
                    author: response.response.docs[i].byline.original,
                    publishDate: response.response.docs[i].pub_date,
                    articleURL: response.response.docs[i].web_url
                };
                articleList.push(articleObject);
            }
        }
        render(recordNumber);
    })
}

const render = function (limit) {
    for (i = 0; i < limit; i++) {
        $(".articles").append(`<a href=${articleList[i].articleURL}>
        <p class="article">
        <p>${articleList[i].headline}</p>
        <p>${articleList[i].author}</p>
        <p>${articleList[i].publishDate}</p></p></a>`);
    }
    $("#searchTerm").val("");
    $("#year1").val("");
    $("#year2").val("");
}

const clearPage = function (event) {
    event.preventDefault();
    articleList = [];
    $(".articles").empty();
}

$("#addArticles").on("click", retrieveArticles);
$("#clearPage").on('click', clearPage);
