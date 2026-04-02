import './ProgressBar.css'

function ProgressBar({ total, completed }) {

    let progress = 0
    if( total>0 ) progress = Math.floor((completed/total)*100)

    return (
        <div className="progress-wrapper my-4">
            <div className="progress">
            <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-body">Progress</span>
                <span className="text-sm font-medium text-body">{progress}%</span>
            </div>
                <div className="progress-bar rounded-full">
                    <div style={{width: progress+'%'}} className="progress-indicator rounded-full">
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProgressBar