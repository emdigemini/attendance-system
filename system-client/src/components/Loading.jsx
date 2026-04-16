const Loading = ({val}) => {
  return (
    <div className="flex items-center justify-center space-x-2 py-6 text-yellow-500">
      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
      <span className="font-medium">Fetching {val}...</span>
    </div>
  )
}

export default Loading