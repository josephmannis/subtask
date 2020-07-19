import React from 'react';
import { SearchGroup } from './styles';
import Icon from '../../atoms/icon/Icon';
import { Input } from '../../atoms/input/TextInput';


interface ISearchBarProps {
    value: string;
    placeholder?: string;
    onChange: (text: string) => void;
}

const SearchBar: React.FC<ISearchBarProps> = ({value, onChange, placeholder}) => {
    return (
        <SearchGroup>
            <Icon type='search' size='small'/>
            <Input value={value} placeholder={placeholder ? placeholder : 'Type to search...'} onChangeText={onChange}/>
        </SearchGroup>
    )
}

export default SearchBar;