const STAGES = ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered'];

const StatusTimeline = ({ status }) => {
  if (status === 'Cancelled') {
    return (
      <div className="status-timeline status-timeline-cancelled">
        <span className="badge badge-unavailable">Order Cancelled</span>
      </div>
    );
  }

  const currentIndex = STAGES.indexOf(status);

  return (
    <div className="status-timeline">
      {STAGES.map((stage, idx) => (
        <div
          key={stage}
          className={`timeline-step ${idx <= currentIndex ? 'completed' : ''} ${idx === currentIndex ? 'current' : ''}`}
        >
          <div className="timeline-dot" />
          <span className="timeline-label">{stage}</span>
          {idx < STAGES.length - 1 && <div className="timeline-line" />}
        </div>
      ))}
    </div>
  );
};

export default StatusTimeline;
