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
  let currentChunk = ""; // 当前正在处理的数据块

  try {
    // 初始化空字符串
    onChunk("", "");

    // 创建一个TextDecoder对象来解码数据
    const decoder = new TextDecoder();
    
    // 处理事件行
    const processEventLine = (line: string) => {
      // 跳过空行
      if (!line.trim()) return;
      
      // 检查是否是SSE格式的数据行
      if (line.startsWith('data:')) {
        const data = line.slice(5).trim(); // 移除"data:"前缀并修剪空白
        
        // 处理特殊的完成标记
        if (data === '[DONE]') {
          console.log('流传输完成');
          return;
        }
        
        try {
          // 解析JSON数据
          const jsonData = JSON.parse(data);
          
          // 立即处理每个新的数据块
          if (jsonData.content !== undefined && jsonData.content !== null) {
            currentChunk = jsonData.content;
            fullContent += currentChunk;
            // 每收到一个数据块就立即触发回调
            onChunk(fullContent, fullReasoningContent);
          }
          
          if (jsonData.reasoning_content !== undefined && jsonData.reasoning_content !== null) {
            const reasoningChunk = jsonData.reasoning_content;
            fullReasoningContent += reasoningChunk;
            // 每收到一个推理数据块就立即触发回调
            onChunk(fullContent, fullReasoningContent);
          }

          // 如果提供了单条消息的回调，也触发它
          if (onNewMessage && currentChunk) {
            onNewMessage(currentChunk);
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

    // 使用stream reader处理响应流
    while (true) {
      const { done, value } = await reader.read();
      
      if (done) {
        break;
      }
      
      // 实时解码并处理新数据
      const chunk = decoder.decode(value, { stream: true });
      buffer += chunk;
      
      // 立即处理每一行
      const lines = buffer.split('\n');
      buffer = lines.pop() || ''; // 保留最后一个不完整的行

      for (const line of lines) {
        processEventLine(line);
      }
    }
    
    // 处理最后一行（如果没有换行符结尾）
    if (buffer.trim()) {
      processEventLine(buffer);
    }

    return { content: fullContent, reasoningContent: fullReasoningContent };
  } catch (error) {
    console.error("读取流时出错:", error);
    throw error;
  }
}
