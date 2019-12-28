import React from "react";
import {Switch,Route,Redirect} from 'react-router-dom'
import {LinksPage} from "./pages/LinksPage";
import {CreatePage} from "./pages/CreatePage";
import {DetailPage} from "./pages/DetailPage";
import {AuthPage} from "./pages/AuthPage";

export const useRouts = isAuthenticated =>{
       let routes =[
        {
            name:'Links',
            url:'/links',
            component: LinksPage,
            exact:true,
            nav:true
        },
        {
            name:'Create',
            url:'/create',
            component: CreatePage,
            exact:true,
            nav:true
        },
       {
           name:'Detail',
           url:'/detail/:id',
           component: DetailPage,
           exact:false,
           nav:true
       },

    ];
    let routsComponents = routes.map((rout)=>{
        return <Route key = {rout.url}
                      path ={rout.url}
                      component = {rout.component}
                      exact={rout.exact}/>
    });



    if(isAuthenticated){
        return(
            <Switch>
                {routsComponents}
                <Redirect to="/create"/>
            </Switch>
        )
    }
    return (
        <Switch>
            <Route patch="/" exact>
                <AuthPage/>
            </Route>
            <Redirect to="/" />
        </Switch>
    )
};