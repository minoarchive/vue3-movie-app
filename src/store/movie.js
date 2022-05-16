import axios from 'axios';
import _uniqBy from 'lodash/uniqBy';

const _defaultMessage = 'Search for the movie title!';

export default {
	// 하나의 store에서 module화 되어 사용할 수 있다는 것을 명시적으로 나타낸다.
	namespaced: true,
	// 우리가 취급해야 하는 data
	state: () => ({
		movies: [],
		message: _defaultMessage,
		loading: false,
		theMovie: {},
	}),
	// computed: 계산된 상태를 만든다.
	getters: {
		// movieIds(state) {
		// 	return state.movies.map((m) => m.imdbID);
		// },
	},
	// methods와 유사
	// 변이: data를 변경시켜 줄 수 있다.
	mutations: {
		updateState(state, payload) {
			Object.keys(payload).forEach((key) => {
				state[key] = payload[key];
			});
		},
		resetMovies(state) {
			state.movies = [];
			state.message = _defaultMessage;
			state.loading = false;
		},
	},
	// methods와 유사
	// 비동기로 동작
	actions: {
		async searchMovies({ state, commit }, payload) {
			if (state.loading) {
				return;
			}
			commit('updateState', {
				message: '',
				loading: true,
			});
			try {
				const res = await _fetchMovie({
					...payload,
					page: 1,
				});
				const { Search, totalResults } = res.data;
				commit('updateState', {
					movies: _uniqBy(Search, 'imdbID'),
				});

				const total = parseInt(totalResults, 10);
				const pageLength = Math.ceil(total / 10);

				// 추가 요청
				if (pageLength > 1) {
					for (let page = 2; page <= pageLength; page += 1) {
						if (page > payload.number / 10) break;
						const res = await _fetchMovie({
							...payload,
							page,
						});
						const { Search } = res.data;
						commit('updateState', {
							movies: [...state.movies, ..._uniqBy(Search, 'imdbID')],
						});
					}
				}
			} catch ({ message }) {
				commit('updateState', {
					movies: [],
					message,
				});
			} finally {
				commit('updateState', {
					loading: false,
				});
			}
		},
		async searchMovieWithId({ state, commit }, payload) {
			if (state.loading) return;

			commit('updateState', {
				theMovie: {},
				loading: true,
			});

			try {
				const res = await _fetchMovie(payload);
				commit('updateState', {
					theMovie: res.data,
				});
			} catch (error) {
				commit('updateState', {
					theMovie: {},
				});
			} finally {
				commit('updateState', {
					loading: false,
				});
			}
		},
	},
};

async function _fetchMovie(payload) {
	return await axios.post('/.netlify/functions/movie', payload);
}
