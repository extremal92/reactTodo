import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import AppHeader from '../app-header/app-header';
import SearchPanel from '../search-panel/search-panel';
import TodoList from '../todo-list/todo-list';
import ItemStatusFilter from '../item-status-filter/item-status-filter';
import ItemAddForm from '../item-add-form/item-add-form';

import '../../index.css';

export default class App extends Component {
  
    maxId = 0;

    state = {
        todoData: [
            this.createTodoItem( 'Drink Coffee' ),
            this.createTodoItem( 'Make Awesome App' ),
            this.createTodoItem( 'Have a lunch' ),
        ],
        term: '',
        filter: 'all'
    }

    createTodoItem(label) {
        return {
            label,
            important: false,
            done: false,
            id: this.maxId++
        }
    }

    deleteItem = (id) => {
        this.setState(({todoData}) => {
            const idx = todoData.findIndex((item) => item.id === id);
            const newArr = [
                ...todoData.slice(0, idx),
                ...todoData.slice(idx + 1)
            ];
            return {  
                todoData: newArr
            };
        });
    };

    addItem = (text) => {

        const newItem = this.createTodoItem(text)

        this.setState(({ todoData }) => {
            const newArr = [
                ...todoData,
                newItem
            ]
            return{
                todoData: newArr
            }
        });
    };

    toggleProperty(arr, id, propName) {
        const idx = arr.findIndex((el) => el.id === id );

        const oldItem = arr[idx];
        const newItem = { ...oldItem, 
            [propName]: !oldItem[propName]};
        return [
            ...arr.slice(0, idx),
            newItem,
            ...arr.slice(idx + 1)
        ];
    }

    onToggleImportant = (id) => {
        this.setState(({ todoData }) => {
            return{
                todoData: this.toggleProperty( todoData, id, 'important')
            }
        });
    };

    onToggleDone = (id) => {
        this.setState(({ todoData }) => {
            return{
                todoData: this.toggleProperty(todoData, id, 'done')
            }
        });
    };
    
    onTermChange = (term) =>{
        this.setState({term});
    }

    onFilterChange = (filter) =>{
        this.setState({filter});
    }
    
    search(items, term) {
        if(term.length === 0) {
            return items
        }
        return items.filter((item) =>{
            return item.label
                .toLowerCase()
                .indexOf(term.toLowerCase()) > -1;
        });
    };
    
    filter(items, filter) {
        switch(filter) {
            case 'all':
                return items;
            case 'active':
                return items.filter((item) => !item.done)
            case 'done':
                return items.filter((item) => item.done)
            case 'important':
                return items.filter((item) => item.important && !item.done)
            default:
                return items;
        }
    }

  render(){
    const { todoData, term, filter } = this.state;

    const visibleItems = this.filter(
        this.search(todoData, term), filter);

    const doneCount = todoData
                        .filter((el) => el.done).length;
    const importantCount = todoData
        .filter((el) => el.important && !el.done).length;
    const todoCount = todoData.length - doneCount
                        
    return (
        <div className="todo-app">
        <AppHeader toDo={todoCount} done={doneCount} important={importantCount}/>
        <div className="top-panel d-flex">
            <SearchPanel 
                onTermChange={this.onTermChange}/>
            <ItemStatusFilter 
                filter={filter}
                onFilterChange={this.onFilterChange}
            />
        </div>

        <TodoList 
            todos={visibleItems} 
            onDeleted={this.deleteItem }
            onToggleImportant={ this.onToggleImportant }
            onToggleDone={ this.onToggleDone }/>
        <ItemAddForm onItemAdded={this.addItem}/>
        </div>
    );
  }
};

