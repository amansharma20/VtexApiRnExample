import {FastImageProps} from 'react-native-fast-image';
export type {Source} from 'react-native-fast-image';
export type {ImageStyle} from 'react-native-fast-image';
export interface ImageProps extends FastImageProps {
  placeholder?: number;
}
const Image = (props: ImageProps) => {
  //   const [hasError, setError] = useState(false);
  //   const _onError = useCallback(() => {
  //     setError(true);
  //   }, []);
  //   let finalSource = hasError ? props.placeholder || IMAGE_PLACEHOLDER : props.source;
  //   if (finalSource?.hasOwnProperty('uri') && !isValidUrl(finalSource.uri)) {
  //     finalSource = props.placeholder || IMAGE_PLACEHOLDER;
  //   }
  //   return <FastImage {...props} source={finalSource} onError={_onError} />;
  // };
  // const isValidUrl = (url?: string | null) => {
  //   return !!(url && (url.startsWith('http://') || url.startsWith('https://')));
};
export default Image;
