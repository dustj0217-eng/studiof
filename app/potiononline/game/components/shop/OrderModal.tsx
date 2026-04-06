'use client';
import { useGame } from '../../lib/gameStore';

export default function OrderModal() {
  const { state, dispatch } = useGame();
  const order = state.orders.find(o => o.id === state.orderModalId);
  if (!order) return null;

  const handleAccept = () => dispatch({ type: 'ACCEPT_ORDER', order });
  const handleClose = () => dispatch({ type: 'CLOSE_ORDER_MODAL' });

  return (
    <>
      <div className={`overlay ${state.orderModalId ? 'open' : ''}`} onClick={handleClose} />
      <div className={`sheet ${state.orderModalId ? 'open' : ''}`}>
        <div className="handle" />

        <div className="sheet-scroll">
          <div className="modal-label">주문 상세</div>

          {/* Customer */}
          <div className="customer-block">
            <div className="cust-avatar">{order.avatarEmoji}</div>
            <div>
              <div className="cust-name">{order.name}</div>
              <div className="cust-meta">{order.type} · 제안 금액 <strong>{order.price.toLocaleString()} G</strong></div>
              {order.backstory && <div className="cust-story">{order.backstory}</div>}
            </div>
          </div>

          {/* Request */}
          <div className="section-title">고객 요청</div>
          <div className="request-box">
            <span className="qm">"</span>{order.request}<span className="qm">"</span>
          </div>

          {/* Hidden intent */}
          <div className="hidden-block">
            <div className="hidden-label">
              <span>✦</span> 마야의 분석 — 숨은 의도
            </div>
            <div className="hidden-text">{order.hidden}</div>
          </div>

          {/* Tags */}
          <div className="section-title">필요 태그</div>
          <div className="tags-row">
            {[...order.reqTags, ...order.hiddenTags].map((t, i) => (
              <span key={i} className={`tag ${i < order.reqTags.length ? 'req' : 'hidden'}`}>{t}</span>
            ))}
          </div>

          {/* Warnings */}
          {order.warning && (
            <div className="warn-box">⚠️ 이 주문은 윤리적 판단이 필요합니다. 신중하게 결정하세요.</div>
          )}
          {order.urgent && (
            <div className="urgent-box">⚡ 긴급 주문입니다. 가능한 빨리 제작해주세요.</div>
          )}

          <button className="accept-btn" onClick={handleAccept}>
            주문 수락 — 제작 시작하기
          </button>
          <button className="decline-btn" onClick={handleClose}>거절</button>
        </div>
      </div>

      <style jsx>{`
        .overlay {
          display: none;
          position: fixed; inset: 0;
          background: rgba(10, 8, 4, 0.6);
          z-index: 60;
        }
        .overlay.open { display: block; }
        .sheet {
          position: fixed; bottom: 0; left: 50%; z-index: 70;
          transform: translateX(-50%) translateY(100%);
          width: 100%; max-width: 430px;
          background: #fff;
          border-radius: 20px 20px 0 0;
          max-height: 88vh;
          transition: transform 0.3s cubic-bezier(0.32, 0.72, 0, 1);
          padding-bottom: env(safe-area-inset-bottom);
        }
        .sheet.open { transform: translateX(-50%) translateY(0); }
        .handle {
          width: 36px; height: 4px;
          background: #e8e0d0; border-radius: 2px;
          margin: 12px auto 0;
        }
        .sheet-scroll {
          padding: 16px 20px 24px;
          overflow-y: auto;
          max-height: calc(88vh - 30px);
        }
        .modal-label {
          font-size: 11px; font-weight: 600;
          letter-spacing: 2px; color: #b0a898;
          text-transform: uppercase;
          margin-bottom: 16px;
          font-family: 'Noto Sans KR', sans-serif;
        }
        .customer-block {
          display: flex; align-items: flex-start; gap: 12px;
          background: #faf8f4;
          border-radius: 12px; padding: 14px;
          margin-bottom: 18px;
          border: 1px solid #f0ede8;
        }
        .cust-avatar {
          width: 48px; height: 48px; border-radius: 50%;
          background: #f5f0e8; border: 1px solid #e8e0d0;
          display: flex; align-items: center; justify-content: center;
          font-size: 22px; flex-shrink: 0;
        }
        .cust-name { font-size: 16px; font-weight: 700; color: #1a1208; margin-bottom: 3px; font-family: 'Noto Sans KR', sans-serif; }
        .cust-meta { font-size: 12px; color: #7a6a50; font-family: 'Noto Sans KR', sans-serif; }
        .cust-meta strong { color: #b8860b; }
        .cust-story { font-size: 11px; color: #9a8a70; margin-top: 5px; line-height: 1.5; font-family: 'Crimson Pro', serif; font-style: italic; }
        .section-title {
          font-size: 11px; font-weight: 600; letter-spacing: 1.5px;
          color: #b0a898; text-transform: uppercase;
          margin: 16px 0 8px;
          font-family: 'Noto Sans KR', sans-serif;
        }
        .request-box {
          background: #faf8f4;
          border-left: 3px solid #d4a017;
          border-radius: 0 10px 10px 0;
          padding: 12px 14px;
          font-size: 16px; color: #1a1208;
          line-height: 1.6;
          font-family: 'Crimson Pro', serif;
          font-style: italic;
          margin-bottom: 2px;
        }
        .qm { color: #d4a017; }
        .hidden-block {
          background: #1a1208;
          border-radius: 12px;
          padding: 14px;
          margin: 14px 0;
        }
        .hidden-label {
          font-size: 10px; letter-spacing: 2px;
          color: #d4a017; text-transform: uppercase;
          margin-bottom: 8px;
          font-family: 'Noto Sans KR', sans-serif;
          font-weight: 600;
          display: flex; align-items: center; gap: 6px;
        }
        .hidden-text {
          font-size: 14px; color: #e0c888;
          line-height: 1.6;
          font-family: 'Crimson Pro', serif;
          font-style: italic;
        }
        .tags-row { display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 14px; }
        .tag {
          font-size: 11px; font-weight: 500;
          padding: 4px 10px; border-radius: 20px;
          font-family: 'Noto Sans KR', sans-serif;
        }
        .tag.req { background: #f5f0e8; color: #5a4a2a; border: 1px solid #e0d4b8; }
        .tag.hidden { background: #1a1208; color: #d4a017; }
        .warn-box {
          background: #fff5f5; border: 1px solid #fcc;
          border-radius: 10px; padding: 10px 12px;
          font-size: 12px; color: #8b1a1a;
          margin-bottom: 10px;
          font-family: 'Noto Sans KR', sans-serif;
          line-height: 1.5;
        }
        .urgent-box {
          background: #fff8f0; border: 1px solid #fcd5b8;
          border-radius: 10px; padding: 10px 12px;
          font-size: 12px; color: #c8470a;
          margin-bottom: 10px;
          font-family: 'Noto Sans KR', sans-serif;
          line-height: 1.5;
        }
        .accept-btn {
          width: 100%; padding: 15px;
          background: #1a1208; color: #d4a017;
          border: none; border-radius: 12px;
          font-size: 14px; font-weight: 700;
          font-family: 'Noto Sans KR', sans-serif;
          letter-spacing: 0.5px; cursor: pointer;
          margin-bottom: 8px;
          transition: opacity 0.15s;
        }
        .accept-btn:active { opacity: 0.85; }
        .decline-btn {
          width: 100%; padding: 13px;
          background: transparent; color: #b0a898;
          border: 1px solid #e8e0d0; border-radius: 12px;
          font-size: 13px; font-family: 'Noto Sans KR', sans-serif;
          cursor: pointer;
        }
      `}</style>
    </>
  );
}