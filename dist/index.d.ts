import * as react_jsx_runtime from 'react/jsx-runtime';
import React from 'react';

interface ReactTagsInputProps {
    tags?: string[];
    options?: string[];
    onChange?: (tags: string[]) => void;
    limit?: number;
    placeholder?: string;
    containerStyle?: React.CSSProperties;
    className?: string;
}
declare function ReactTagsInput(props: ReactTagsInputProps): react_jsx_runtime.JSX.Element;

export { ReactTagsInput as default };
