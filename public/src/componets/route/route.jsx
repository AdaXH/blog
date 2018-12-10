import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import Dynamic from './../dynamic/dynamic'
import { Article } from './../article/article'
import { ArticleDetail } from './../detail/detail'
import { Message } from './../message/message'
import { About } from '../about/about'
import { Index } from '../index'
import { Search } from '../search/search'
import { Admin } from '../admin/admin'
export const RouteConfig = () => {
    return (
        <div className="view">
                <Switch>
                    <Route path='/index' component={Index} />
                    <Route path='/dynamic' component={Dynamic} />
                    <Route path='/article' exact component={Article} />
                    <Route path='/article/:id' component={ArticleDetail} />
                    <Route path='/message' component={Message} />
                    <Route path='/about' component={About} />
                    <Route path='/search/:wd' component={Search} />
                    <Route path='/admin' component={Admin} />
                    <Redirect from='/*' to='/index'></Redirect>
            </Switch>
        </div>
    )
}