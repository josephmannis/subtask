import React from 'react';
import { SearchGroup, SearchInput } from './styles';
import Icon from '../../atoms/icon/Icon';


interface ISearchBarProps {
    value: string;
    placeholder?: string;
    onChange: (text: string) => void;
}

const SearchBar: React.FC<ISearchBarProps> = ({value, onChange, placeholder}) => {
    return (
        <SearchGroup>
            <Icon type='search' size='small'/>
            <SearchInput value={value} placeholder={placeholder ? placeholder : 'Type to search...'} onChangeText={onChange}/>
        </SearchGroup>
    )
}

export default SearchBar;