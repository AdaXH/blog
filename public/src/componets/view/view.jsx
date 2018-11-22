import React from 'react'
import './view.css'
import { Route, Switch, Redirect } from 'react-router-dom'
import Dynamic from './../dynamic/dynamic'
import { Article } from './../article/article'
import { ArticleDetail } from './../detail/detail'
import Message from './../message/message'
export const View = () => {
    return(
        <div className="view">
            <Switch>
                <Route path='/index' component={Dynamic}/>
                <Route path='/article' component={Article}/>ArticleDetail
                <Route path='/article:id' component={ArticleDetail}/>
                <Route path='/message' component={Message} />
                <Redirect to='/index'></Redirect>
            </Switch>
        </div>
    )
}