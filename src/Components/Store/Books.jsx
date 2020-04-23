import React, { Component } from 'react';

import axios from 'axios';

export default class Books extends Component {
    constructor(props) {
        super(props);
        this.state = {
            books: [],
        };

        this.loadBooks();
    }

    loadBooks = async () => {
        const books = await axios.get('http://localhost:4000/api/books');
        const status = books.status;
        if (status === 200) {
            this.setState({
                books: books.data.map((book) => {
                    return { title: book.title, author: book.author };
                }),
            });
        }
    };

    render() {
        const books = this.state.books;
        return (
            <div>
                <h1>Books</h1>
                {books.map((book, index) => {
                    return (
                        <h4 className="mb-64" key={index}>
                            {book.title + ', ' + book.author}
                        </h4>
                    );
                })}
            </div>
        );
    }
}
