export async function handleSSEResponse(
  response: Response,
  onChunk: (text: string, reasoningText: string) => void,
  onNewMessage?: (message: string) => void
): Promise<{ content: string; reasoningContent: string }> {
  if (!response.body) {
    throw new Error("响应没有可读流");
  }

  const reader = response.body.getReader();
  let buffer = "";
  let fullContent = "";
  let fullReasoningContent = "";
  let currentChunk = "";

  // 添加打字机效果的函数
  const typewriterEffect = async (text: string, isContent: boolean) => {
    let displayText = isContent ? fullContent : fullReasoningContent;
    for (let i = 0; i < text.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 0)); // 10ms 延迟
      if (isContent) {
        fullContent = displayText + text.slice(0, i + 1);
        onChunk(fullContent, fullReasoningContent);
      } else {
        fullReasoningContent = displayText + text.slice(0, i + 1);
        onChunk(fullContent, fullReasoningContent);
      }
    }
  };

  try {
    onChunk("", "");
    const decoder = new TextDecoder();
    
    const processEventLine = async (line: string) => {
      if (!line.trim()) return;
      
      if (line.startsWith('data:')) {
        const data = line.slice(5).trim();
        
        if (data === '[DONE]') {
          console.log('流传输完成');
          return;
        }
        
        try {
          const jsonData = JSON.parse(data);
          
          if (jsonData.content !== undefined && jsonData.content !== null) {
            currentChunk = jsonData.content;
            // 使用打字机效果显示内容
            await typewriterEffect(currentChunk, true);
            if (onNewMessage) onNewMessage(currentChunk);
          }
          
          if (jsonData.reasoning_content !== undefined && jsonData.reasoning_content !== null) {
            const reasoningChunk = jsonData.reasoning_content;
            // 使用打字机效果显示推理内容
            await typewriterEffect(reasoningChunk, false);
          }
        } catch (e) {
          console.error('解析SSE数据失败:', e);
        }
      } else if (line.startsWith('event:')) {
        // 处理事件类型，如果API支持的话
        const eventType = line.slice(6).trim();
        console.log('事件类型:', eventType);
      } else if (line.startsWith('id:')) {
        // 处理事件ID，如果API支持的话
        const eventId = line.slice(3).trim();
        console.log('事件ID:', eventId);
      } else if (line.startsWith('retry:')) {
        // 处理重试时间，如果API支持的话
        const retryTime = parseInt(line.slice(6).trim(), 10);
        console.log('重试时间:', retryTime);
      }
    };

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      const chunk = decoder.decode(value, { stream: true });
      buffer += chunk;
      
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        await processEventLine(line);
      }
    }
    
    if (buffer.trim()) {
      await processEventLine(buffer);
    }

    return { content: fullContent, reasoningContent: fullReasoningContent };
  } catch (error) {
    console.error("读取流时出错:", error);
    throw error;
  }
}
