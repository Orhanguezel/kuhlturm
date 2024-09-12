document.addEventListener('DOMContentLoaded', () => {
    const articleTitles = document.getElementById('article-titles');
    const articleTitle = document.getElementById('article-title');
    const articleContent = document.getElementById('article-content');

    articles.forEach((article, index) => {
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = '#';
        link.textContent = `${index + 1}. ${article.title}`;
        link.addEventListener('click', () => {
            showArticle(article);
        });
        listItem.appendChild(link);
        articleTitles.appendChild(listItem);
    });

    function showArticle(article) {
        articleTitle.textContent = article.title;
        articleContent.innerHTML = article.content;
    }
});
