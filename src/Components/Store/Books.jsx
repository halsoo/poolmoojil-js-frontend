import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getBooksAPI } from '../../util/api';

import axios from 'axios';

class Books extends Component {
    constructor(props) {
        super(props);
        this.state = {
            books: [],
        };

        this.loadBooks();
    }

    loadBooks = async () => {
        const books = await getBooksAPI();
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

const MapStateToProps = (state) => ({
    logged: state.logged,
    cookie: state.cookie,
});

const MapDispatchToProps = {};

export default connect(MapStateToProps, MapDispatchToProps)(Books);
