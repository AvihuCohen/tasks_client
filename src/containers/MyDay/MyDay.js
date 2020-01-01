import React, {Component} from 'react';
import classes from './MyDay.module.css';
import List from '../../components/List/List';
import {connect} from  'react-redux';
import * as actions from "../../store/actions";

class MyDay extends Component {

    findMyDayList = () => {
       return this.props.lists.find(list => list.name.toLowerCase() === "my day");
    };


    render() {
        let list = this.props.lists ? this.findMyDayList() : null;

        return  this.props.lists?  <div className={classes.MyDay}>
            {/*<List list={list} isMyDay={true}/>*/}
            <List list={list} isMyDay={false}/>
        </div> : null;
    }
};



const mapStateToProps = state => {
    return {
        lists: state.lists.lists
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setCurrentList : (list) => dispatch(actions.setList(list))

    };
};


export default connect(mapStateToProps, mapDispatchToProps)(MyDay);

