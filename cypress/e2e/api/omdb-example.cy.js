/// <reference types='cypress'/>
const baseURL = `http://www.omdbapi.com`
const apiKey = `472c8a85`
const movieTitle = 'The Lord of the Rings: The Fellowship of the Ring'
const movieID = 'tt0120737'
const validSearchQuery = 'Batman'
const invalidSearchQuery = 'InvalidQuery'

describe('OMDB API Movie Information', () => {
  it('Get movie information by its title', () => {
    cy.request({
      method: 'GET',
      url: `${baseURL}/?t=${movieTitle}&apikey=${apiKey}`,
    }).then((response) => {
      expect(response.status).to.eq(200)
      const { Title, Year, Director, Writer, imdbRating, imdbID } = response.body
      expect(Title).to.eq(movieTitle)
      expect(imdbID).to.match(/^tt\d{7}$/)
      const propertiesToValidate = [Year, Director, Writer, imdbRating]
      // Iterate over properties and assert they are not empty or null
      propertiesToValidate.forEach((property) => {
        expect(property).to.not.be.empty
        expect(property).to.not.be.null
      })
    })
  })
  it('Get movie information by its ID', () => {
    cy.request({
      method: 'GET',
      url: `${baseURL}/?i=${movieID}&apikey=${apiKey}`,
    }).then((response) => {
      expect(response.status).to.eq(200)
      const { Title, Year, Director, Writer, imdbRating, imdbID } = response.body
      expect(imdbID).to.eq(movieID)
      expect(imdbID).to.match(/^tt\d{7}$/)
      const propertiesToValidate = [Title, Year, Director, Writer, imdbRating]
      // Iterate over properties and assert they are not empty or null
      propertiesToValidate.forEach((property) => {
        expect(property).to.not.be.empty
        expect(property).to.not.be.null
      })
    })
  })
  it('Search movies with a valid search query', () => {
    cy.request({
      method: 'GET',
      url: `${baseURL}/?s=${validSearchQuery}&apikey=${apiKey}`,
    }).then((response) => {
      expect(response.status).to.eq(200)
      const { Search, totalResults, Response } = response.body
      expect(Response).to.eq('True')
      expect(Number(totalResults)).to.be.greaterThan(0)
      expect(Search).to.be.an('array').that.is.not.empty
      Search.forEach((movie) => {
        const { Title, Year, imdbID, Type, Poster } = movie
        expect(Title).to.not.be.empty
        expect(Year).to.not.be.empty
        expect(imdbID).to.match(/^tt\d{7,8}$/)
        expect(Type).to.not.be.empty
        expect(Poster).to.not.be.empty
      })
    })
  })
  it('Search movies with an invalid search query', () => {
    cy.request({
      method: 'GET',
      url: `${baseURL}/?s=${invalidSearchQuery}&apikey=${apiKey}`,
    }).then((response) => {
      expect(response.status).to.eq(200)
      const { Response, Error } = response.body
      expect(Response).to.eq('False')
      expect(Error).to.eq('Movie not found!')
    })
  })
})
