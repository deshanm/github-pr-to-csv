import axios from 'axios'

export const getPullRequests = async ({ owner, repo, per_page, labels, page = 1 }) => {
    try {
        const url = `https://api.github.com/search/issues?q=repo:${owner}/${repo}+is:pr+is:merged+language:javascript+label:"${labels.join(',')}"&per_page=${per_page}&page=${page}`
        console.log('PR API Query:', url)
        const results = await axios.get(url)
        return results.data
    } catch (error) {
        console.log(error)
    }
}
