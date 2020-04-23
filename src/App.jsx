import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Nav from './Components/Nav/Nav';
import Books from './Components/Store/Books';
import GatheringMain from './Components/Gathering/GatheringMain';
import Main from './Components/Main/Main';
import About from './Components/About/About';
import Footer from './Components/Footer/Footer';

function App() {
    return (
        <div className="App">
            <Router>
                <Route path="/" component={Nav} />
                <div className="lg:grid lg:grid-cols-12 lg:gap-2">
                    <div
                        className="lg:mt-3 lg:mb-3 
                                    sm:mx-auto sm:px-10 sm:mt-8
                                    sm:flex sm:w-full 
                                    lg:col-start-3 lg:col-end-11"
                    >
                        <Switch>
                            <Route exact path="/" component={Main} />
                            <Route exact path="/main" to="/" />
                            <Route exact path="/about" component={About} />
                            <Route exact path="/gathering" component={GatheringMain} />
                            <Route exact path="/package" component={Books} />
                            <Route exact path="/store" component={Books} />
                            <Route exact path="/notice" component={Books} />
                        </Switch>
                    </div>
                </div>
            </Router>
            <Footer />
        </div>
    );
}

export default App;
